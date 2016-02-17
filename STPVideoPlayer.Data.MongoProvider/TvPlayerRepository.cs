using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using STPVideoPlayer.DataLayer;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace STPVideoPlayer.Data.MongoProvider
{
    public class TvPlayerRepository : TvPlayerRepositoryBase, ITvPlayerRepository
    {
        MongoDB.Driver.IMongoDatabase database = null;
        MongoDB.Driver.IMongoCollection<TimeLineModel> col = null;

        const string _collectionName = "TimeLines";

        private MongoDB.Driver.IMongoCollection<TimeLineModel> TimeLines
        {
            get
            {
                if (col == null)
                    col = database.GetCollection<TimeLineModel>(_collectionName);

                return col;
            }
        }

        private MongoDB.Driver.IMongoCollection<DbInfo> DbInfos
        {
            get
            {
                return database.GetCollection<DbInfo>("DbInfos");
            }
        }

        private DbInfo DbInfo
        {
            get
            {
                return this.DbInfos.Find(x => x.Name.Equals(DataBaseName)).FirstOrDefault();
            }
        }

        public TvPlayerRepository() : base()
        {
            var client = new MongoClient(ConnectionString);
            database = client.GetDatabase(DataBaseName);
        }

        public void Reseed()
        {
            database.DropCollection(_collectionName);
        }

        public List<TimeLineModel> GetDataItems()
        {
            var query = from e in this.TimeLines.AsQueryable<TimeLineModel>()
                        select e;

            return query.ToList();
        }

        public void Initialize()
        {
            var items = GetDataItems();

            FileInfo file = new FileInfo(base.ProgramInitialFilePath);

            if (items.Count < 1)
            {
                ImportProcessor.ImportXmlFile(file.FullName, insertTimeLine);
            }

            items = GetDataItems();

            TimeSpan min = items.Min(x => x.Start);
            TimeSpan max = items.Max(x => x.End);

            while (max.Hours > 1 && max.Hours < 23)
            {
                foreach (var item in items)
                {
                    var newItem = (TimeLineModel)item.Clone();
                    newItem.Start = max.Add(new TimeSpan(0, 0, 1));
                    TimeSpan duration = item.End.Subtract(item.Start);
                    newItem.End = newItem.Start.Add(duration);
                    max = newItem.End;

                    if (newItem.End.Hours == 1)
                        break;

                    insertTimeLine(newItem);
                }
            }

            FileSystemWatcherHelper fsw = new FileSystemWatcherHelper();
            fsw.FileDataChanged += Fsw_FileDataChanged;
            fsw.WatchFile(file.Directory.FullName, Path.GetFileName(file.FullName));
        }

        private void insertTimeLine(TimeLineModel timeLine)
        {
            timeLine.Id = ObjectId.GenerateNewId().ToString();
            this.TimeLines.InsertOne(timeLine);
        }

        private void Fsw_FileDataChanged(object sender, EventArgs e)
        {
            Reseed();
            Initialize();
        }

        public TimeLineModel FindById(string elementId)
        {
            var id = new ObjectId(elementId);
            return this.TimeLines.Find(x => new ObjectId(x.Id.ToString()) == id).FirstOrDefault();
        }

        public TimeLineModel FindByName(string elementName, StringComparison comparison = StringComparison.OrdinalIgnoreCase)
        {
            var timeLine = this.TimeLines.Find(x => x.Name.Equals(elementName)).FirstOrDefault();
            return timeLine;
        }

        public TimeLineModel FindByTime(TimeSpan? startTime, TimeSpan? endTime)
        {
            IMongoQueryable<TimeLineModel> query = this.TimeLines.AsQueryable();

            if (startTime.HasValue)
                query = query.Where(x => x.Start <= startTime.Value);

            if (endTime.HasValue)
                query = query.Where(x => x.End >= endTime.Value);

            return query.OrderBy(x => x.Start).FirstOrDefault();
        }

        public TimeLineModel NextOneByTime(TimeSpan? startTime)
        {
            IMongoQueryable<TimeLineModel> query = this.TimeLines.AsQueryable();

            if (startTime.HasValue == false)
                startTime = DateTime.Now.TimeOfDay;

            query = query.Where(x => x.Start >= startTime.Value);

            return query.OrderBy(x => x.Start).FirstOrDefault();
        }

        public void InsertOne(TimeLineModel timeLine)
        {
            insertTimeLine(timeLine);
        }

        public void CreateIfOlder()
        {
            if (GetDataItems().Count == 0)
            {
                Reseed();
                Initialize();
                insertDbInfo();
            }
            else {
                var dbInfo = this.DbInfo;

                if (dbInfo == null)
                {
                    Reseed();
                    Initialize();
                    insertDbInfo();
                }
                else
                {
                    if(DbInfo.LastSynchro < XmlFileLastWriteDate)
                    {
                        Reseed();
                        Initialize();
                        insertOrUpdateDbInfo();
                    }
                }
            }
        }

        private void insertDbInfo()
        {
            this.DbInfos.InsertOne(new DbInfo()
            {
                Id=  ObjectId.GenerateNewId(), LastSynchro = DateTime.Now, Name = DataBaseName
            });
        }

        private void insertOrUpdateDbInfo()
        {
            var dbInfo = this.DbInfo;

            if (DbInfo == null)
            { 
                insertDbInfo();
            }
            else
            {
                var filter = new FilterDefinitionBuilder<DbInfo>().Eq(x => x.Id, dbInfo.Id);
                dbInfo.LastSynchro = DateTime.Now;
                this.DbInfos.ReplaceOne(filter, dbInfo);
            }
        }

        public TimeLineModel FindNextByType(TimeSpan? startTime, string type)
        {
            IMongoQueryable<TimeLineModel> query = this.TimeLines.AsQueryable();

            if (startTime.HasValue == false)
                startTime = DateTime.Now.TimeOfDay;

            query = query.Where(x => x.Start >= startTime.Value && x.Type== type);

            return query.OrderBy(x => x.Start).FirstOrDefault();
        }
    }
}
