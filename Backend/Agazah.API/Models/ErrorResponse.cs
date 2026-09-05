namespace Agazah.API.Models;
public class ErrorResponse
{
    public int StatusCode {get; set;}
    public string Message {get; set;} = string.Empty;
    public IEnumerable<string>? Errors { get; set; }
    public DateTime TimeStamp {get; set;}
}