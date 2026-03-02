const MB = 10; // 10 MB
const FILE_SIZE_LIMIT = MB * 1024 * 1024; // We use uppercase letters to refer it as a constant

const fileSizeLimiter = (req, res, next) => {
  const files = req.files;
  const filesOverLimit = [];

  Object.keys(files).forEach((key) => {
    const fileOrList = files[key];
    const list = Array.isArray(fileOrList) ? fileOrList : [fileOrList];
    list.forEach((file) => {
      if (file.size > FILE_SIZE_LIMIT) {
        filesOverLimit.push(file.name);
      }
    });
  });

  if (filesOverLimit.length) {
    const properVerb = filesOverLimit.length > 1 ? "are" : "is";

    const sentence =
      `Upload failed. ${filesOverLimit.toString()} ${properVerb} over the file size limit of ${MB} MB.`.replaceAll(
        ",",
        ", "
      );

    const message =
      filesOverLimit.length < 3
        ? sentence.replace(",", " and")
        : sentence.replace(/,(?=[^,]*$)/, " and");

    return res.status(413).json({ status: "Error!", message });
  }

  next();
};

module.exports = fileSizeLimiter;
