# Firebase Console Performance Dashboard

This project measures the page load latency Firebase Console.

## Measurement

The measurement process involves:

- run WebPageTest against above webpages to obtain measurement numbers
- aggregate raw samples and store results into database (Google Cloud Sql)

See [WebPageTest](https://www.webpagetest.org) and
[Google Cloud Sql](https://cloud.google.com/sql/) for more
information.

## Dashboarding

The above aggregated results are then pulled from data storage and presented
in a Google Data Studio.

See [Google Data Studio](https://datastudio.google.com/overview) for more
information.

## How to run test

### Premise

The test requires a GCP project for providing a sql database instance.

It also requires a few environment variables:

- WPT_API_KEY: The api key used to submit request to WebPageTest
- CLOUD_SQL_HOST: The host of Cloud Sql database instance
- CLOUD_SQL_USER: The username used to login to database
- CLOUD_SQL_PASSWORD: The password used to login to database

### Trial run

`yarn test` will trigger a trial run of the test, which is conducting the test
against a small combination of devices/browsers and network conditions.

See `package.json` for details.

### Formal run

Formal run is to test against a comprehensive list of devices/browsers and
network conditions. It is scheduled to run daily and always against the latest
released version.

## Contributing

To contribute a change, check out the [contributing guide](CONTRIBUTING.md).

## License

The contents of this repository is licensed under the
[Apache License, version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

## Disclaimer

This is not an officially supported Google product.
