
const match = (condition) => ({
    $match: condition
});

const skip = (size) => ({
    $skip: parseInt(size)
});

const sort = (condition) => ({
    $sort: condition
});

const limit = (size) => ({
    $limit: parseInt(size)
});

const project = (projection) => ({
    $project: projection
});

const group = (groupDef) => ({
    $group: groupDef
});

const text = (searchString) => ({
    $text: {$search: searchString}
});

const _in = (arrayOfValues) => ({
    $in: arrayOfValues
});

const _and = (arrayOfValues) => ({
   $and: arrayOfValues
});

module.exports = {
    match,
    skip,
    sort,
    limit,
    project,
    group,
    text,
    _in,
    _and
};
