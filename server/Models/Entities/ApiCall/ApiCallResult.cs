namespace server.Models.Entities.ApiCall
{
    public class ApiCallResult<T>
    {
        public T? Entity { get; set; }
        public ApiCallError? Error { get; set; }
    }
}
