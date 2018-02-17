// services
const {getCompany} = require(process.cwd() + '/services/company');

/**
 * Controller definition to get a company account's information
 * @function getCompany
 * @param companyId - a mongodb id that points to a company to be fetch
 * @return {Object} - the object containing the specified company information
 */
module.exports = async (companyId) => {

    // id validations by the id-parsing middleware
    let query = {_id: companyId};
    let projection = '-jobs -role -hash -salt';
    let lean = true;
    let company = await getCompany(query, projection, lean);

    if (company) {
        company.jobs_url = `/companies/${companyId}/jobs`;
    }

    return company;
};
