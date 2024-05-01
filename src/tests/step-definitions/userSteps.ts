import {  When, Then } from '@cucumber/cucumber';
import  {HttpResponse} from "../httpClient";
import HttpClient from "../httpClient";
import {JobSeekerCreationAttributes, JobSeekerProfile} from "../../types/jobSeekerTypes";
import {expect} from "chai";

let lastResponse: HttpResponse<JobSeekerProfile | Array<JobSeekerProfile>>;
const httpClient = new HttpClient();

When('I submit a request to create a job seeker with the following details', async function (dataTable) {
    const data = dataTable.hashes();
    for (const row of data) {
        const jobSeekerData: JobSeekerCreationAttributes = {
            name: row.name,
            email: row.email,
            sectorPreference: row.sectorPreference,
        };
        lastResponse = await httpClient.request<JobSeekerProfile>('POST','job-seekers', jobSeekerData as unknown as Record<string, unknown>);
    }
});

Then('I should receive a {int} response and the profile should be created', function (expectedStatus) {
    expect(lastResponse.status).to.equal(expectedStatus);
    // If status is 201, we assume the profile is correctly created. Additional checks can be added here.
    if (expectedStatus === 201) {
        expect(lastResponse.data).to.include.keys('id', 'name', 'email', 'sectorPreference');
    }
});
