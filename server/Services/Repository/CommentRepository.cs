using Microsoft.AspNetCore.JsonPatch;
using server.Models.Entities;
using server.Models.Enums;

namespace server.Services.Repository
{
    public class CommentRepository : ICommentRepository
    {
        private static readonly List<Comment> _comments = [
            new() {
                DateTime = new DateTimeOffset(2024, 6, 7, 17, 32, 5, TimeSpan.Zero),
                Id = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd24"),
                Replies = [],
                Score = 2,
                Text = "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
                User = new() {
                    EmailAddress = "amyrobson@email.com",
                    Id = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd26"),
                    Username = "amyrobson"
                },
                UserId = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd26"),
                Votes = [
                    new() {
                        CommentId = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd24"),
                        Id = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd00"),
                        Type = VoteType.UP,
                        UserId = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd27")
                    },
                    new() {
                        CommentId = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd24"),
                        Id = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd01"),
                        Type = VoteType.UP,
                        UserId = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd28")
                    },
                ],
            },
            new() {
                DateTime = new DateTimeOffset(2024, 7, 15, 9, 28, 53, TimeSpan.Zero),
                Id = new Guid("fca3c54d-941c-42c6-8c2a-42a0f97dcf70"),
                Replies = [
                    new() {
                        DateTime = new DateTimeOffset(2024, 7, 25, 14, 5, 42, TimeSpan.Zero),
                        Id = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd15"),
                        ParentId = new Guid("fca3c54d-941c-42c6-8c2a-42a0f97dcf70"),
                        ReplyToUser = new() {
                            EmailAddress = "maxblagun@email.com",
                            Id = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd27"),
                            Username = "maxblagun"
                        },
                        ReplyToUserId = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd27"),
                        Replies = [],
                        Score = 1,
                        Text = "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
                        User = new() {
                            EmailAddress = "ramsesmiron@email.com",
                            Id = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd28"),
                            Username = "ramsesmiron"
                        },
                        UserId = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd28"),
                        Votes = [
                            new() {
                                CommentId = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd15"),
                                Id = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd02"),
                                Type = VoteType.UP,
                                UserId = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd25")
                            },
                        ],
                    },
                    new() {
                        DateTime = new DateTimeOffset(2024, 8, 1, 12, 5, 58, TimeSpan.Zero),
                        Id = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd16"),
                        ParentId = new Guid("fca3c54d-941c-42c6-8c2a-42a0f97dcf70"),
                        ReplyToUser = new() {
                            EmailAddress = "ramsesmiron@email.com",
                            Id = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd28"),
                            Username = "ramsesmiron"
                        },
                        ReplyToUserId = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd28"),
                        Replies = [],
                        Score = 0,
                        Text = "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
                        User = new() {
                            EmailAddress = "me@email.com",
                            Id = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd25"),
                            Username = "me"
                        },
                        UserId = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd25"),
                        Votes = [],
                    },
                ],
                Score = -1,
                Text = "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
                User = new() {
                    EmailAddress = "maxblagun@email.com",
                    Id = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd27"),
                    Username = "maxblagun"
                },
                UserId = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd27"),
                Votes = [
                    new() {
                        CommentId = new Guid("fca3c54d-941c-42c6-8c2a-42a0f97dcf70"),
                        Id = new Guid("fca3c54d-941c-42c6-8c2a-42a0f97dcf69"),
                        Type = VoteType.DOWN,
                        UserId = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd25")
                    },
                ],
            },
        ];

        // TODO: Make this method async after adding DbContext
        public Task<Comment> CreateAsync(Comment comment)
        {
            comment.DateTime = DateTime.UtcNow;
            comment.Id = Guid.NewGuid();

            if (comment.ParentId is null)
            {
                _comments.Add(comment);
            }
            else
            {
                var parentComment = _comments.Find(c => c.Id.Equals(comment.ParentId));
                parentComment?.Replies.Add(comment);
            }

            return Task.FromResult(comment);
        }

        // TODO: Make this method async after adding DbContext
        public Task<Comment?>? DeleteAsync(Guid userId, Guid id, Guid? parentId)
        {
            // TODO: Use await after adding DbContext
            var comment = GetByIdAsync(id, parentId).Result;

            if (comment?.UserId != userId)
            {
                return null;
            }

            if (comment is not null)
            {
                if (comment.ParentId is null)
                {
                    _comments.Remove(comment);
                }
                else
                {
                    var parentComment = _comments.Find(c => c.Id.Equals(comment.ParentId));
                    parentComment?.Replies.Remove(comment);
                }
            }

            return Task.FromResult(comment);
        }

        // TODO: Make this method async after adding DbContext
        public Task<IEnumerable<Comment>> GetAllAsync()
        {
            var comments = _comments;
            // Sorting descending by score
            comments.Sort((comment1, comment2) => comment2.Score.CompareTo(comment1.Score));

            return Task.FromResult(comments.AsEnumerable());
        }

        // TODO: Make this method async after adding DbContext
        public Task<Comment?> GetByIdAsync(Guid id, Guid? parentId)
        {
            Comment? comment;

            if (parentId is null)
            {
                comment = _comments.Find(c => c.Id.Equals(id));
            }
            else
            {
                var parentComment = _comments.Find(c => c.Id.Equals(parentId));
                comment = parentComment?.Replies.Find(r => r.Id.Equals(id));
            }

            return Task.FromResult(comment);
        }

        // TODO: Make this method async after adding DbContext
        public Task<Comment?> PatchAsync(Guid id, Guid? parentId, JsonPatchDocument<Comment> patch)
        {
            // TODO: Use await after adding DbContext
            var comment = GetByIdAsync(id, parentId).Result;

            if (comment is not null)
            {
                patch.ApplyTo(comment);
            }

            return Task.FromResult(comment);
        }
    }
}
