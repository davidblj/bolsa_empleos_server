exports.fetchJobsURL = '/guest/fetchJobs';

// language, jobType, technicalRole, urgent - salary, name, date
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

exports.jobs = [
    {
        jobName: "Software developer 1",
        ownerCompany: "pragma",
        description: "description",
        candidateType: "student",
        languages: "English",
        expiryDate: "0/0/0",
        salary: 0,
        jobType: "Full time",
        technicalRole: "Developer",
        urgent: false,
    },
    {
        jobName: "Software developer 2",
        ownerCompany: "pragma",
        description: "description",
        candidateType: "student",
        languages: "Portuguese",
        expiryDate: "0/0/0",
        salary: 0,
        jobType: "Full time",
        technicalRole: "Developer",
        urgent: false,
    },
    {
        jobName: "Software developer 3",
        ownerCompany: "pragma",
        description: "description",
        candidateType: "student",
        languages: "German",
        expiryDate: "0/0/0",
        salary: 0,
        jobType: "Part time",
        technicalRole: "Developer",
        urgent: false,
    }
];