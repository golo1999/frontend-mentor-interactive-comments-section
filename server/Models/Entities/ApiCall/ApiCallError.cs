using server.Models.Enums;

namespace server.Models.Entities.ApiCall
{
    public class ApiCallError
    {
        public required string Message { get; set; }
        public required ApiCallErrorType Type { get; set; }
    }
}
