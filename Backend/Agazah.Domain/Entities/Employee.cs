namespace Agazah.Domain.Entities;
using Agazah.Domain.Common;
using Agazah.Domain.Enums;
public class Employee : BaseEntity
{
    public string EmployeeNumber {get; set;} = null!;
    public string EmployeeName {get; set;} = null!;
    public DateTime BirthDate {get; set;}
    public Qualification Qulaification {get; set;}
    public ICollection<Vacation> Vacations {get; set;}
        = new List<Vacation>();
}