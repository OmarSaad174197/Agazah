using Agazah.Application.DTOs.Employee;
using FluentValidation;

namespace Agazah.Application.Validators.Employee;

public class UpdateEmployeeDtoValidator
    : AbstractValidator<UpdateEmployeeDto>
{
    public UpdateEmployeeDtoValidator()
    {
        RuleFor(x => x.EmployeeName)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.BirthDate)
            .LessThan(DateTime.Today);

        RuleFor(x => x.Qualification)
            .IsInEnum();
    }
}