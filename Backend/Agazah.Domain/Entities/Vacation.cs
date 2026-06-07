namespace Agazah.Domain.Entities;
using Agazah.Domain.Common;
using Agazah.Domain.Enums;
public class Vacation : BaseEntity
{
    public long EmployeeId {get; set;}
    public VacationType VacationType {get; set;}
    public DateTime StartDate {get; set;}
    public int Duration {get; set;}
    public Employee Employee {get; set;} = null!;
}