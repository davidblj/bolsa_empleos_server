exports.fetchJobsURL = '/guest/fetchJobs';
exports.getJobsURL = '/guest/getAvailableOffers';

// language, jobType, technicalRole, urgent,  name, ownerCompany, salary - date,

//pipe organization is done with all documents
//pipe filtering by text, job type, technicalRole and salary is done with the first 3 documents

exports.queryByText = {
    find: "UI"
};

exports.queryBySalary = {
    salary: 2000000
};

exports.queryByUnknownValue = {
    languages: "Japanese",
};

exports.queryByMultipleValues = {
    languages: "German,Portuguese",
    jobType: "Full time,Part time"
};

exports.queryByJobAndRole = {
    jobType: "Full time",
    technicalRole: "Developer"
};

exports.queryByLanguageJobAndRole = {
    languages: "English",
    jobType: "Full time",
    technicalRole: "Developer"
};

exports.queryByAllOptions = {
    find: "pragma",
    salary: 1500000,
    jobType: "Full time",
    technicalRole: "Developer"
};

exports.paginateByDate = {
    dayPosted: 5
};

// By default documents are inserted in order (insertMany). https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#behaviors
// An objectId is sorted naturally (almost). https://docs.mongodb.com/manual/reference/bson-types/#objectid

exports.jobs_filter = [
    {
        jobName: "Software Engineer",
        ownerCompany: "psl",
        description: "description",
        candidateType: "student",
        languages: "German",
        expiryDate: "0/0/0",
        salary: 3000000,
        jobType: "Part time",
        setTimeOffset: '',
        technicalRole: "Developer",
        urgent: false,
    },
    {
        jobName: "Web UI Developer",
        ownerCompany: "pragma",
        description: "description",
        candidateType: "student",
        languages: "Portuguese",
        expiryDate: "0/0/0",
        salary: 2000000,
        jobType: "Full time",
        setTimeOffset: '',
        technicalRole: "Developer",
        urgent: false,
    },
    {
        jobName: "Software Developer",
        ownerCompany: "pragma",
        description: "description",
        candidateType: "student",
        languages: "English",
        expiryDate: "0/0/0",
        jobType: "Full time",
        salary: 1200000,
        technicalRole: "Developer",
        setTimeOffset: '',
        urgent: false,
    }
];

exports.jobs_pagination = [
    {
        jobName: "Software Engineer",
        ownerCompany: "psl",
        description: "description",
        candidateType: "student",
        languages: "German",
        expiryDate: "0/0/0",
        salary: 3000000,
        jobType: "Part time",
        technicalRole: "Developer",
        urgent: false,
        timePosted: getDate(0)
    },
    {
        jobName: "Web UI Developer",
        ownerCompany: "pragma",
        description: "description",
        candidateType: "student",
        languages: "Portuguese",
        expiryDate: "0/0/0",
        salary: 2000000,
        jobType: "Full time",
        technicalRole: "Developer",
        urgent: false,
        timePosted: getDate(1)
    },
    {
        jobName: "Software Developer",
        ownerCompany: "pragma",
        description: "description",
        candidateType: "student",
        languages: "English",
        expiryDate: "0/0/0",
        salary: 1200000,
        jobType: "Full time",
        technicalRole: "Developer",
        urgent: false,
        timePosted: getDate(2)
    },
    {
        jobName: "Business analyst",
        ownerCompany: "yuxi",
        description: "description",
        candidateType: "student",
        languages: "French",
        expiryDate: "0/0/0",
        salary: 4000000,
        jobType: "Contract",
        technicalRole: "Analyst",
        urgent: false,
        timePosted: getDate(3)
    },
    {
        jobName: "Quality Assurance analyst",
        ownerCompany: "yuxi",
        description: "description",
        candidateType: "student",
        languages: "French",
        expiryDate: "0/0/0",
        salary: 6000000,
        jobType: "Contract",
        technicalRole: "Analyst",
        urgent: false,
        timePosted: getDate(4)
    },
    {
        jobName: "Marketing analyst",
        ownerCompany: "yuxi",
        description: "description",
        candidateType: "student",
        languages: "French",
        expiryDate: "0/0/0",
        salary: 5000000,
        jobType: "Contract",
        technicalRole: "Analyst",
        urgent: false,
        timePosted: getDate(5)
    },
    {
        jobName: "QA Automation",
        ownerCompany: "globant",
        description: "description",
        candidateType: "student",
        languages: "English",
        expiryDate: "0/0/0",
        salary: 3000000,
        jobType: "Contract",
        technicalRole: "Tester",
        urgent: false,
        timePosted: getDate(6)
    },
    {
        jobName: "QA Engineer",
        ownerCompany: "globant",
        description: "description",
        candidateType: "student",
        languages: "English",
        expiryDate: "0/0/0",
        salary: 3500000,
        jobType: "Contract",
        technicalRole: "Tester",
        urgent: false,
        timePosted: getDate(7)
    },
    {
        jobName: "Test Automation Engineer",
        ownerCompany: "globant",
        description: "description",
        candidateType: "student",
        languages: "English",
        expiryDate: "0/0/0",
        salary: 2000000,
        jobType: "Contract",
        technicalRole: "Tester",
        urgent: false,
        timePosted: getDate(8)
    }
];

function getDate(index) {

    let daysArray = [1, 5, 10, 15, 20, 25, 30, 1, 5];
    let dayInMillis = daysArray[index] * 24 * 60 * 60 * 1000;
    let date = new Date();
    date = new Date(date.getTime() - dayInMillis);

    return date;
}