using AutoMapper;
using server.Models.DTOs;
using server.Models.Entities;

namespace server.API
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<CommentDTO, Comment>();
            CreateMap<VoteDTO, Vote>();
        }
    }
}
