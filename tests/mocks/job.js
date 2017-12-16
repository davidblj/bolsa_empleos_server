exports.fetchJobsURL = '/guest/fetchJobs';
exports.getJobsURL = '/guest/getAvailableOffers';

// language, jobType, technicalRole, urgent,  name, ownerCompany, salary - date,

exports.queryByText = {
    find: "UI"
};

exports.queryBySalary = {
    salary: 2000000
};

exports.queryByUnknownValue = {
    languages: "Japanese"
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

exports.jobs = [
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
    },
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
    }
];