using Microsoft.AspNetCore.JsonPatch;
using Microsoft.EntityFrameworkCore;
using server.Models.Contexts;
using server.Models.Entities;
using server.Models.Entities.PaginatedResult;

namespace server.Services.Repository
{
    public class CommentRepository(DatabaseContext context) : ICommentRepository
    {
        private readonly DatabaseContext _context = context;

        public async Task<Comment> CreateAsync(Comment comment)
        {
            var createdComment = await _context.Comments.AddAsync(comment);
            await _context.SaveChangesAsync();

            return createdComment.Entity;
        }

        public async Task<Comment?> DeleteAsync(Guid id, Guid? parentId = null)
        {
            var comment = await GetByIdAsync(id, parentId);

            if (comment is null)
            {
                return null;
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return comment;
        }

        public async Task<IEnumerable<Comment>> GetAllAsync()
        {
            // Retrieving first-level comments
            var comments = await _context.Comments.Where(c => c.ParentId == null).ToListAsync();

            foreach (var comment in comments)
            {
                if (comment.ReplyToUserId is not null)
                {
                    comment.ReplyToUser = await _context.Users.FirstAsync(u => u.Id.Equals(comment.ReplyToUserId));
                }

                comment.Replies = (await GetRepliesByIdAsync(comment.Id)).ToList();
                comment.User = await _context.Users.FirstAsync(u => u.Id.Equals(comment.UserId));
                comment.Votes = (await GetVotesByIdAsync(comment.Id, comment.ParentId)).ToList();
            }

            // Sorting descending by score
            comments.Sort((comment1, comment2) =>
            {
                var result = comment2.Score.CompareTo(comment1.Score);
                // If two comments have the same score, sorting by "dateTime" field
                return result == 0 ? comment1.DateTime.CompareTo(comment2.DateTime) : result;
            });

            return comments;
        }

        // Paginated comments
        public async Task<PaginatedResult<Comment>> GetAllAsync(int first, Guid? after = null)
        {
            // Retrieving first-level comments
            List<Comment> paginatedComments;
            var allComments = await _context.Comments.Where(c => c.ParentId == null).ToListAsync();

            // Sorting descending by score
            allComments.Sort((comment1, comment2) =>
            {
                var result = comment2.Score.CompareTo(comment1.Score);
                // If two comments have the same score, sorting by "dateTime" field
                return result == 0 ? comment1.DateTime.CompareTo(comment2.DateTime) : result;
            });

            if (after is null)
            {
                paginatedComments = allComments.Take(first + 1).ToList();
            }
            else
            {
                paginatedComments = allComments.SkipWhile(comment => !comment.Id.Equals(after)).Skip(1).Take(first + 1).ToList();
            }

            if (paginatedComments.Count == 0)
            {
                return new PaginatedResult<Comment>
                {
                    Edges = [],
                    PageInfo = new PageInfo
                    {
                        EndCursor = null,
                        HasNextPage = false
                    },
                    TotalCount = 0
                };
            }

            var hasNextPage = paginatedComments.Count == first + 1;

            for (var index = 0; index < (hasNextPage ? paginatedComments.Count - 1 : paginatedComments.Count); ++index)
            {
                var comment = paginatedComments[index];

                if (comment.ReplyToUserId is not null)
                {
                    comment.ReplyToUser = await _context.Users.FirstAsync(u => u.Id.Equals(comment.ReplyToUserId));
                }

                comment.Replies = (await GetRepliesByIdAsync(comment.Id)).ToList();
                comment.User = await _context.Users.FirstAsync(u => u.Id.Equals(comment.UserId));
                comment.Votes = (await GetVotesByIdAsync(comment.Id, comment.ParentId)).ToList();
            }

            var edges = (hasNextPage ? paginatedComments.Take(first) : paginatedComments).Select(comment => new Edge<Comment>
            {
                Cursor = comment.Id,
                Node = comment
            }).ToList();
            var pageInfo = new PageInfo
            {
                EndCursor = hasNextPage ? paginatedComments[^2].Id : paginatedComments[^1].Id,
                HasNextPage = hasNextPage
            };
            var totalCount = hasNextPage ? paginatedComments.Count - 1 : paginatedComments.Count;

            return new PaginatedResult<Comment>
            {
                Edges = edges,
                PageInfo = pageInfo,
                TotalCount = totalCount
            };
        }

        public async Task<Comment?> GetByIdAsync(Guid id, Guid? parentId = null)
        {
            Comment? comment;

            if (parentId is null)
            {
                comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id.Equals(id));
            }
            else
            {
                comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id.Equals(id) && c.ParentId.Equals(parentId));
            }

            if (comment is null)
            {
                return null;
            }

            if (comment.ReplyToUserId is not null)
            {
                comment.ReplyToUser = await _context.Users.FirstAsync(u => u.Id.Equals(comment.ReplyToUserId));
            }

            comment.Replies = (await GetRepliesByIdAsync(comment.Id)).ToList();
            comment.User = await _context.Users.FirstAsync(u => u.Id.Equals(comment.UserId));
            comment.Votes = (await GetVotesByIdAsync(comment.Id, comment.ParentId)).ToList();

            return comment;
        }

        public async Task<IEnumerable<Comment>> GetRepliesByIdAsync(Guid parentId)
        {
            var replies = await _context.Comments.Where(c => c.ParentId.Equals(parentId)).ToListAsync();

            foreach (var reply in replies)
            {
                reply.User = await _context.Users.FirstAsync(u => u.Id.Equals(reply.UserId));
                reply.Votes = (await GetVotesByIdAsync(reply.Id, reply.ParentId)).ToList();
            }

            replies.Sort((reply1, reply2) => reply1.DateTime.CompareTo(reply2.DateTime));

            return replies;
        }

        public async Task<IEnumerable<Vote>> GetVotesByIdAsync(Guid id, Guid? parentId = null)
        {
            return await _context.Votes.Where(v => v.CommentId.Equals(id) && v.ParentCommentId.Equals(parentId)).ToListAsync();
        }

        public async Task<Comment?> PatchAsync(Guid id, JsonPatchDocument<Comment> patch, Guid? parentId = null)
        {
            var comment = await GetByIdAsync(id, parentId);

            if (comment is null)
            {
                return null;
            }

            patch.ApplyTo(comment);
            await _context.SaveChangesAsync();

            return comment;
        }
    }
}
