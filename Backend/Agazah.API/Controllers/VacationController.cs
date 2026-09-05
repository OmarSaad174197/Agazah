using Agazah.Application.DTOs.Vacation;
using Agazah.Application.DTOs.Vacations;
using Agazah.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
namespace Agazah.API.Controllers;

[ApiController]
[Route("api/[controller]")]

public class VacationController : ControllerBase
{
    private readonly IVacationService _vacationService;
    public VacationController(
        IVacationService vacationService)
    {
        _vacationService = vacationService;
    }

    [HttpPost]
    public async Task<ActionResult<long>> Create(
        CreateVacationDto dto,
        CancellationToken cancellationToken)
    {
        var id = await _vacationService.CreateAsync(
            dto, cancellationToken);
        
        return Ok(id);
    }

    [HttpGet("employee/{employeeId:long}")]
    public async Task<ActionResult<
    List<VacationResponseDto>>>
    GetEmployeeVacations(
        long employeeId,
        CancellationToken cancellationToken)
    {
        var vacations =
            await _vacationService
                .GetEmployeeVacationsAsync(
                    employeeId,
                    cancellationToken);

        return Ok(vacations);
    }

    [HttpDelete("{vacationId:long}")]
    public async Task<IActionResult> Delete(
        long vacationId,
        CancellationToken cancellationToken)
    {
        await _vacationService.DeleteAsync(
            vacationId,
            cancellationToken
        );

        return NoContent();
    }
}
