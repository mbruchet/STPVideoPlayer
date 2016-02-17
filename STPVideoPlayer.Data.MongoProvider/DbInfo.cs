using MongoDB.Bson;
using System;

namespace STPVideoPlayer.Data.MongoProvider
{
    public class DbInfo
    {
        public ObjectId Id { get; set; }
        public string Name { get; set; }
        public DateTime LastSynchro { get; set; }
    }
}
