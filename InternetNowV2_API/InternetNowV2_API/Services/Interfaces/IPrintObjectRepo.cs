using InternetNow_API.DTOs;

namespace InternetNowV2_API.Services.Interfaces
{
    public interface IPrintObjectRepo
    {
        Task<bool> WriteLog(string strLog);
        Task<FileContent> GetReportInfo();
        Task<string> GenerateObjectString(PrintObject printObject);
    }
}
