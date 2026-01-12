using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sahaj.API.Model
{
    public class CommonUpload
    {
        public string FolderNames { get; set; }      
        public string FileName { get; set; }
        public long ? FileSize { get; set; }
        public string Url { get; set; }
    }

    public class FileChunkModel
    {
        public string FileName { get; set; }  // Original file name
        public int ChunkIndex { get; set; }  // Current chunk number
        public int TotalChunks { get; set; } // Total number of chunks
        public long FileSize { get; set; }   // Total file size (for validation)
        public IFormFile FileChunk { get; set; } // Chunk data
        public string FolderNames { get; set; }

    }

}