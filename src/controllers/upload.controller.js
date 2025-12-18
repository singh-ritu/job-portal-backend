export const uploadResumeController = async (req, res) => {
   try {
    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required"
      });
    }

    return res.status(200).json({
      message: "Resume uploaded successfully",
      resumeUrl: req.file.path
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Resume upload failed"
    });
  }
}