// const fetch = require("node-fetch");
const express = require("express");
const fetch = require("node-fetch");
const {
  DerivativesApi,
  JobPayload,
  JobPayloadInput,
  JobPayloadOutput,
  JobSvfOutputPayload,
} = require("forge-apis");

const { getClient, getInternalToken } = require("./common/oauth");

let router = express.Router();

router.use(async (req, res, next) => {
  const token = await getInternalToken();
  req.oauth_token = token;
  req.oauth_client = getClient();
  next();
});

router.post("/jobs", async (req, res, next) => {
  let job = new JobPayload();
  job.input = new JobPayloadInput();
  job.input.urn = req.body.objectName;
  job.input.checkReferences = true;
  job.output = new JobPayloadOutput([new JobSvfOutputPayload()]);
  job.output.formats[0].type = "svf";
  job.output.formats[0].views = ["2d", "3d"];

  try {
    const response1 = await new DerivativesApi().setReferences(
      req.body.objectName,
      {
        urn: "urn:adsk.objects:os.object:usm0dhmimvnajzitqci9iqyvagpclntw-inventor2/scissors.iam",
        filename: "scissors.iam",
        references: [
          {
            urn: "urn:adsk.objects:os.object:usm0dhmimvnajzitqci9iqyvagpclntw-inventor2/blade_main.ipt",
            relativePath: "Components/blade_main.ipt",
            filename: "blade_main.ipt",
          },
          {
            urn: "urn:adsk.objects:os.object:usm0dhmimvnajzitqci9iqyvagpclntw-inventor2/blade_top.ipt",
            relativePath: "Components/blade_top.ipt",
            filename: "blade_top.ipt",
          },
          {
            urn: "urn:adsk.objects:os.object:usm0dhmimvnajzitqci9iqyvagpclntw-inventor2/scissor_spring.ipt",
            relativePath: "Components/scissor_spring.ipt",
            filename: "scissor_spring.ipt",
          },
        ],
      },
      {},
      req.oauth_client,
      req.oauth_token
    );
    console.log(response1);
    const response = await new DerivativesApi().translate(
      job,
      {},
      req.oauth_client,
      req.oauth_token
    );
    console.log(response);
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
