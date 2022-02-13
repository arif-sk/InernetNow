using InternetNow_API.DTOs;
using InternetNow_API.Infrastructure;
using InternetNowV2_API.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;


namespace InternetNow_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrintObjectController : ControllerBase
    {
        public static bool IsStopCounter = false;
        public static int NumberCount = 0;
        public static int FloatCount = 0;
        public static int CharacterCount = 0;
        private readonly IPrintObjectRepo _printObjectRepo;
        public PrintObjectController(IPrintObjectRepo printObjectRepo)
        {
            _printObjectRepo = printObjectRepo;
        }

        [HttpPost("count")]
        public async Task<ActionResult> StartCount(PrintObject printObject)
        {
            //Initialize Count
            NumberCount = 0;
            FloatCount = 0;
            CharacterCount = 0;
            string pathToSave = Path.Combine(Environment.CurrentDirectory, @"UploadFiles\", "myFile.txt");
            FileInfo logFileInfo = new FileInfo(pathToSave);
            if (logFileInfo.Exists)
            {
                logFileInfo.Delete();
            }
            await _printObjectRepo.WriteLog("");
            var fileSize = new FileInfo(pathToSave).Length;
            var fileSizeInKB = fileSize / 1024;
            while (fileSizeInKB < printObject.FileSize)
            {
                var hasStopped = HttpContext.Session.GetString("IsStopped");
                if (IsStopCounter == true)
                {
                    IsStopCounter = false;
                    //HttpContext.Session.Clear();
                    break;
                }
                var resultString = await _printObjectRepo.GenerateObjectString(printObject);
                if (printObject.IsNeumericCount == true) NumberCount += printObject.NumericPercentage;
                if (printObject.IsFloatCount == true) FloatCount += printObject.FloatPercentage;
                if (printObject.IsAlphaneumericCount == true) CharacterCount += printObject.AlphanumericPercentage;
                await _printObjectRepo.WriteLog(resultString);
                fileSize = new FileInfo(pathToSave).Length;
                fileSizeInKB = fileSize / 1024;
            }
            return Ok(true);
        }

        [HttpPost("stopcount")]
        public async Task<ActionResult> StopCount()
        {
            // Tried to use session but in other controller getting session value null.
            // Couldn't resolve that issue.
            HttpContext.Session.SetString("IsStopped", "false"); 
            IsStopCounter = true;
            var objectCounter = new ObjectCounter()
            {
                NumberCount = NumberCount,
                FloatCount = FloatCount,
                CharacterCount = CharacterCount
            };
            return Ok(objectCounter);
        }

        [HttpGet("generatereport")]
        public async Task<ActionResult> GenerateReport()
        {
            var fileContent = await _printObjectRepo.GetReportInfo();
            return Ok(fileContent);
        }

        [HttpGet("broadcastcounter")]
        public async Task<ActionResult> BroadcastCounter()
        {
            var objectCounter = new ObjectCounter()
            {
                NumberCount = NumberCount,
                FloatCount = FloatCount,
                CharacterCount = CharacterCount
            };
            return Ok(objectCounter);
        }
    }
}
