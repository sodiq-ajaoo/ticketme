class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };

    Object.keys(queryObj).forEach((key) => {
      if (
        queryObj[key] === '' ||
        queryObj[key] === undefined ||
        queryObj[key] === null
      ) {
        delete queryObj[key];
      }
    });

    // Save keyword before removing it
    const keyword = queryObj.keyword;

    const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];

    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    // Search
    // if (keyword) {
    //   this.query = this.query.find({
    //     $or: [
    //       { name: { $regex: keyword, $options: 'i' } },
    //       { summary: { $regex: keyword, $options: 'i' } },
    //       { description: { $regex: keyword, $options: 'i' } },
    //       { state: { $regex: keyword, $options: 'i' } },
    //       { city: { $regex: keyword, $options: 'i' } },
    //       { venue: { $regex: keyword, $options: 'i' } },
    //       { 'location.address': { $regex: keyword, $options: 'i' } },
    //     ],
    //   });
    // }

    // Search
    // if (keyword) {
    //   this.query = this.query.find({
    //     $or: [
    //       { name: { $regex: keyword, $options: 'i' } },
    //       { summary: { $regex: keyword, $options: 'i' } },
    //       { description: { $regex: keyword, $options: 'i' } },
    //       { venue: { $regex: keyword, $options: 'i' } },
    //     ],
    //   });
    // }

    if (keyword) {
      this.query = this.query.find({
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { summary: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { state: { $regex: keyword, $options: 'i' } },
          { city: { $regex: keyword, $options: 'i' } },
          { venue: { $regex: keyword, $options: 'i' } },
          { 'location.address': { $regex: keyword, $options: 'i' } },
          { 'location.description': { $regex: keyword, $options: 'i' } },
        ],
      });
    }

    //     $or: [
    //   { name: { $regex: keyword, $options: 'i' } },
    //   { summary: { $regex: keyword, $options: 'i' } },
    //   { description: { $regex: keyword, $options: 'i' } },
    //   { state: { $regex: keyword, $options: 'i' } },
    //   { city: { $regex: keyword, $options: 'i' } },
    //   { venue: { $regex: keyword, $options: 'i' } },
    //   { "location.address": { $regex: keyword, $options: 'i' } },
    // ]

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');

      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;

    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  // paginate() {
  //   const page = this.queryString.page * 1 || 1;
  //   const limit = this.queryString.limit * 1 || 12;

  //   const skip = (page - 1) * limit;

  //   this.query = this.query.skip(skip).limit(limit);

  //   return this;
  // }
}

module.exports = APIFeatures;
