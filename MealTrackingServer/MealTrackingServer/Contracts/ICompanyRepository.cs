using MealTrackingServer.Entities.Models;

namespace MealTrackingServer.Contracts
{
    public interface ICompanyRepository
    {
        IEnumerable<Company> GetAllCompanies(bool trackChanges);
    }
}
