using Agazah.Application.DTOs.Vacation;
using Agazah.Application.DTOs.Vacations;
using Agazah.Domain.Entities;
using AutoMapper;

namespace Agazah.Application.Mappings;

public class VacationProfile : Profile
{
    public VacationProfile()
    {
        CreateMap<CreateVacationDto, Vacation>();

        CreateMap<Vacation, VacationResponseDto>();
    }
}