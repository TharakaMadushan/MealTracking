namespace MealTrackingServer.Contracts
{
    public interface IRepositoryManager
    {

        ICompanyRepository Company { get; }
        void Save();
    }
}
