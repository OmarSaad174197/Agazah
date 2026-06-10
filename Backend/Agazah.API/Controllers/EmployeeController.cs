using Agazah.Application.Common;
using Agazah.Application.DTOs.Employee;
using Agazah.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace Agazah.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly IEmployeeService _employeeService;

    public EmployeesController(
        IEmployeeService employeeService)
    {
        _employeeService = employeeService;
    }

    [HttpPost]
    public async Task<ActionResult<long>> Create(
        CreateEmployeeDto dto,
        CancellationToken cancellationToken)
    {
        var id =
            await _employeeService.CreateAsync(
                dto,
                cancellationToken);

        return CreatedAtAction(
            nameof(GetById),
            new { id },
            id);
    }

    [HttpGet("{id:long}")]
    public async Task<ActionResult<EmployeeDetailsDto>>
        GetById(
            long id,
            CancellationToken cancellationToken)
    {
        var employee =
            await _employeeService.GetDetailsAsync(
                id,
                cancellationToken);

        return Ok(employee);
    }

    [HttpPut("{id:long}")]
    public async Task<IActionResult> Update(
        long id,
        UpdateEmployeeDto dto,
        CancellationToken cancellationToken)
    {
        await _employeeService.UpdateAsync(
            id,
            dto,
            cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Delete(
        long id,
        CancellationToken cancellationToken)
    {
        await _employeeService.DeleteAsync(
            id,
            cancellationToken);

        return NoContent();
    }

    [HttpGet]
    public async Task<ActionResult<
        PagedResult<EmployeeResponseDto>>>
        GetPaged(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 5,
            CancellationToken cancellationToken = default)
    {
        var result =
            await _employeeService.GetPagedAsync(
                pageNumber,
                pageSize,
                cancellationToken);

        return Ok(result);
    }
}