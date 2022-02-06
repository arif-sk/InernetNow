using InternetNow_API.DTOs;
using InternetNow_API.Infrastructure;
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
        private readonly IHubContext<BroadcastHub, IHubClient> _hubContext;

        public PrintObjectController(IHubContext<BroadcastHub, IHubClient> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpPost("count")]
        public ActionResult StartCount(PrintObject printObject)
        {
            PrintObjectToFile(printObject);
            return Ok(printObject);
        }

        [HttpPost("stopcount")]
        public IActionResult StopCount()
        {
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
        public IActionResult GenerateReport()
        {
            return Ok(GetFile());
        }

        [HttpGet("broadcastcounter")]
        public async Task<IActionResult> BroadcastCounter()
        {
            var objectCounter = new ObjectCounter() {
                NumberCount = NumberCount,
                FloatCount = FloatCount,
                CharacterCount = CharacterCount
            };
            await _hubContext.Clients.All.BroadcastMessage();
            return Ok(objectCounter);
        }

        private PrintObject PrintObjectToFile(PrintObject printObject)
        {
            InitializeCounter();
            DeleteFile();
            if (printObject.FileSize > 0) WriteFileBySize(printObject);
            else WriteFileWithoutSize(printObject);
            return null;
        }

        private void InitializeCounter()
        {
            NumberCount = 0;
            FloatCount = 0;
            CharacterCount = 0;
        }

        private void WriteFileBySize(PrintObject printObject)
        {
            string pathToSave = Path.Combine(Environment.CurrentDirectory, @"UploadFiles\", "myFile.txt");
            var fileSize = new FileInfo(pathToSave).Length;
            var fileSizeInKB = fileSize / 1024;
            while (fileSizeInKB < printObject.FileSize)
            {
                if (IsStopCounter)
                {
                    IsStopCounter = false;
                    break;
                }
                WriteLog(generateLine(printObject));
                fileSize = new FileInfo(pathToSave).Length;
                fileSizeInKB = fileSize / 1024;
            }
        }

        private string generateLine(PrintObject printObject)
        {
            string numeric = printObject.IsNeumericCount ? GenerateRandomNumeric().ToString() : "";
            string alphaNeumeric = printObject.IsAlphaneumericCount ? GenerateAlphaNeumeric() : "";
            string floatNumber = printObject.IsFloatCount ? GenerateRandomFloat().ToString() : "";
            string result = "";
            if(!string.IsNullOrEmpty(numeric)) result += numeric + ",";
            if(!string.IsNullOrEmpty(alphaNeumeric)) result += alphaNeumeric + ",";
            if(!string.IsNullOrEmpty(floatNumber)) result += floatNumber + ",";
            return result;
        }

        private void WriteFileWithoutSize(PrintObject printObject)
        { 
            while (true)
            {
                if (IsStopCounter)
                {
                    IsStopCounter = false;
                    break;
                }
                WriteLog(generateLine(printObject));
            }
        }

        private FileContent GetFile()
        {
            FileContent fileContent = new FileContent();
            string pathToSave = Path.Combine(Environment.CurrentDirectory, @"UploadFiles\", "myFile.txt");
            FileInfo logFileInfo = new FileInfo(pathToSave);
            if (logFileInfo.Exists)
            {
                using (StreamReader file = new StreamReader(pathToSave))
                {
                    int counter = 0;
                    string ln;

                    while ((ln = file.ReadLine()) != null)
                    {
                        ln = ln.TrimEnd(',');
                        string[] arr = ln.Split(',');
                        foreach(var a in arr)
                        {
                            if (int.TryParse(a, out int value))
                            {
                                fileContent.NeumericCount++;
                                if (counter <= 20) fileContent.contentItems.Add($"{a} - numeric");

                            }
                            else if (float.TryParse(a, out float stringVal))
                            {
                                fileContent.FloatCount++;
                                if (counter <= 20) fileContent.contentItems.Add($"{a} - float");

                            }
                            else
                            {
                                fileContent.AlphaneumericCount++;
                                if (counter <= 20) fileContent.contentItems.Add($"{a} - alphanumeric");
                            }
                            counter++;
                        }
                    }
                    file.Close();
                }
            }
            return fileContent;
        }

        private void DeleteFile()
        {
            string pathToSave = Path.Combine(Environment.CurrentDirectory, @"UploadFiles\", "myFile.txt");
            FileInfo logFileInfo = new FileInfo(pathToSave);
            if (logFileInfo.Exists)
            {
                logFileInfo.Delete();
            }
            WriteLog("");
        }

        public void WriteLog(string strLog)
        {
            StreamWriter log;
            FileStream fileStream = null;
            DirectoryInfo logDirInfo = null;
            FileInfo logFileInfo;           
            string fileName = "myFile.txt";
            string pathToSave = Path.Combine(Environment.CurrentDirectory, @"UploadFiles\", fileName);
            logFileInfo = new FileInfo(pathToSave);
            logDirInfo = new DirectoryInfo(logFileInfo.DirectoryName);

            if (!logDirInfo.Exists) logDirInfo.Create();
            if (!logFileInfo.Exists)
            {
                fileStream = logFileInfo.Create();
            }
            else
            {
                fileStream = new FileStream(pathToSave, FileMode.Append);
            }
            log = new StreamWriter(fileStream);
            if(!string.IsNullOrEmpty(strLog))
                log.Write(strLog);
            log.Close();
        }

        private int GenerateRandomNumeric()
        {
            Random random = new Random();
            int number = random.Next(1, int.MaxValue);
            NumberCount++;
            return number;
        }
        private float GenerateRandomFloat()
        {
            Random random = new Random();
            double val = (random.NextDouble() * (1000 - 1) + 1);
            FloatCount++;
            return (float)val;

        }
        private string GenerateAlphaNeumeric()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            Random random = new Random();
            CharacterCount++;
            return new string(Enumerable.Repeat(chars, 10)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
