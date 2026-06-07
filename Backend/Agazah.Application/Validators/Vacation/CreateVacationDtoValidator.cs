using Agazah.Application.DTOs.Vacations;
using FluentValidation;

namespace Agazah.Application.Validators.Vacation;

public class CreateVacationDtoValidator
    : AbstractValidator<CreateVacationDto>
{
    public CreateVacationDtoValidator()
    {
        RuleFor(x => x.EmployeeId)
            .GreaterThan(0);

        RuleFor(x => x.VacationType)
            .IsInEnum();

        RuleFor(x => x.Duration)
            .InclusiveBetween(1, 30);

        RuleFor(x => x.StartDate)
            .NotEmpty();
    }
}