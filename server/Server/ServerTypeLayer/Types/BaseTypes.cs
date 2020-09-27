using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServerTypeLayer
{
    public enum AUTH_TYPES {
        LIST,
        GET,
        INSERT,
        UPDATE,
        VIEW,
        EXPORT,
        IMPORT
    }

    public class BaseType
    {
        [Column("createdDate")]
        public DateTime? CreatedDate { get; set; }
        [Column("updatedDate")]
        public DateTime? UpdatedDate { get; set; }

    }
   
    public class SessionContext
    {
        public LoggedInUser CurrentUser { get; set; } = new LoggedInUser();
        public string SessionGuid { get; set; }
        public string Token { get; set; }
        public DateTime? TokenExpires { get; set; }
        public DateTime? LastLogin { get; set; }
        public bool IsAuthenticated { get; set; }
        public string PreferredLocale { get; set; }
    }

    public class ResponseWrapper
    {
        public bool Success { get; set; } = false;
        public string Message { get; set; } = "";
        public dynamic Data { get; set; }
    }

    public class RequestWithPagination<T>
    {
        public Pagination Pagination { get; set; }
        public T Content { get; set; }
    }

    public class PaginationWrapper<T>
    {
        public Pagination Pagination { get; set; } = new Pagination();
        public IList<T> List { get; set; } = new List<T>();
    }
    // Server side pagination
    public class Pagination
    {
        private int _totalRowCount;
        private int _maxRowsPerPage = Constants.ROW_COUNT_PER_PAGE;

        public int CurrentPage { get; set; } = 1;
        public int MaxPage { get; set; }
        public int TotalRowCount
        {
            get => _totalRowCount;
            set
            {
                _totalRowCount = value;
                MaxPage = (int)Math.Ceiling(_totalRowCount / (double)MaxRowsPerPage);
                if (TotalRowCount > 0 && ResultRowCount == 0)
                    CurrentPage = MaxPage;
            }
        }
        public int RowOffset { get => (Math.Max(CurrentPage, 1) - 1) * MaxRowsPerPage; }

        public int MaxRowsPerPage
        {
            get => _maxRowsPerPage;
            set => _maxRowsPerPage = Math.Max(Math.Min(value, Constants.ROW_COUNT_PER_PAGE), 1);
        }

        public int ResultRowCount { get; set; }
    }
}
