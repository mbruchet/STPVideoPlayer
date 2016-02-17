using System;
using System.Collections.Generic;

namespace STPVideoPlayer.DataLayer
{
    public interface ITvPlayerRepository
    {
        void Reseed();
        void Initialize();
        List<TimeLineModel> GetDataItems();
        TimeLineModel FindById(string elementId);
        TimeLineModel FindByName(string elementName, StringComparison comparison = StringComparison.OrdinalIgnoreCase);
        void InsertOne(TimeLineModel timeLine);
        TimeLineModel FindByTime(TimeSpan? startTime, TimeSpan? endTime);
        TimeLineModel NextOneByTime(TimeSpan? startTime);
        TimeLineModel FindNextByType(TimeSpan? startTime, string type);
        void CreateIfOlder();
    }
}
