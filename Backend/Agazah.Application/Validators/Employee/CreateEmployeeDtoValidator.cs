using Agazah.Application.DTOs.Employee;
using FluentValidation;

namespace Agazah.Application.Validators.Employee;

public class CreateEmployeeDtoValidator
    : AbstractValidator<CreateEmployeeDto>
{
    public CreateEmployeeDtoValidator()
    {
        RuleFor(x => x.EmployeeNumber)
            .NotEmpty()
            .MaximumLength(50)
            .Must(x=> !string.IsNullOrWhiteSpace(x));

        RuleFor(x => x.EmployeeName)
            .NotEmpty()
            .MaximumLength(200)
            .Must(x=> !string.IsNullOrWhiteSpace(x));


        RuleFor(x => x.BirthDate)
            .LessThan(DateTime.UtcNow.Date);

        RuleFor(x => x.Qualification)
            .IsInEnum();
    }
}