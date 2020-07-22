import React, { useContext, useState, useEffect } from "react";
import { Divider } from 'antd';
import Row from "../Components/Row"
import Column from "../Components/Columns"
import Card from "../Components/Card"
import Layout from "../Components/Layout"
import List from "../Components/List"
import ListItem from "../Components/ListItem"
import Button from "../Components/Button"
import Breadcrumb from "../Components/Breadcrumb"
import axios from "axios"
import { WoundContext } from "../Context/WoundContext"
import { PatientContext } from "../Context/PatientContext"

function WoundHistoryPage() {

    //Context with selected patient info:
    const { patient } = useContext(PatientContext)
    //Context with selected wound info:
    const { Wound } = useContext(WoundContext)

    //States to store assessment data:
    const [assessmentList, setList] = useState([])
    const [singleAssessment, setAssessment] = useState({})

    //Function to retreive patient assessments from DB:
    async function loadAssessments() {
        try {
            const { data } = await axios.get(`/api/AllAssessments/${Wound.id}`)
            setList(data)
        }
        catch (error) { console.log(error) }
    }
    //To retrieve one assessment:
    async function oneAssessment(id) {
        try {
            const { data } = await axios.get(`/api/assessment/${id}`)
            setAssessment(data)
        }
        catch (error) { console.log(error) }
    }
    //Load all assessments when page loads:
    useEffect(() => {
        loadAssessments()
    }, [])


    return <>
        <Breadcrumb navArray={[{ label: `Patient: ${patient.FirstName} ${patient.LastName}`, link: "/patient" }, { label: `Wound: ${Wound.WoundLocation}(${Wound.DateDiscovered})`, link: "/wound" }]} />
        <Layout>
            <Row>
                <Column size={"is-5"}>
                    <Row>
                        <Card title={"Wound details:"}>
                            <p><b>Wound Location: </b>{Wound.WoundLocation}</p>
                            <Divider />
                            <p><b>Date Discovered: </b>{Wound.DateDiscovered}</p>
                            <Divider />
                            <p><b>Aetiology: </b>{Wound.Aetiology}</p>
                            <Divider />
                            <p><b>Additional Information/Assessments: </b><br></br>{Wound.AdditionalInfo}</p>
                        </Card>
                    </Row>
                    <Row>
                        <Card title={"Assessment History:"}>
                            {assessmentList.length ?
                                <List>
                                    {assessmentList.map(({ AssessmentDate, id }) => (
                                        <ListItem key={id}>
                                            <Button onClick={() => oneAssessment(id)} ><p><b>Review Date:</b> {AssessmentDate} </p></Button>
                                        </ListItem>
                                    ))}
                                </List>
                                : <div><i>No wound assessments currently in this record.</i></div>}

                        </Card>
                    </Row>
                </Column>
                <Column size={"is-6"}>
                    <Button link={"/wound_assessment"}>Enter New Assessment</Button>
                    <Row>
                        {singleAssessment.id ?
                            (<Card title={`Wound review (${singleAssessment.AssessmentDate})`}>
                                <h3>Assessment Details:</h3>
                                <ul>
                                    <li><b>Tissue Base:</b> {singleAssessment.TissueBase}</li>
                                    <li><b>Infection:</b> {singleAssessment.Infection ? "Yes" : "No"} </li>
                                    <li><b>Odour:</b> {singleAssessment.Odour ? "Yes" : "No"}</li>
                                    <li><b>Moisture:</b> {singleAssessment.Moisture} </li>
                                    <li><b>Exudate type: </b>{singleAssessment.Exudate}</li>
                                    <li><b>Edges:</b> {singleAssessment.Edges} </li>
                                    <li><b>Length: </b> {singleAssessment.Length}mm</li>
                                    <li><b>Width:</b> {singleAssessment.Width}mm </li>
                                    <li><b>Depth: </b> {singleAssessment.Depth}mm</li>
                                </ul>
                                <h3>Dressing Regimen:</h3>
                                <ul>
                                    <li><b>Cleanse: </b>{singleAssessment.Cleanse}</li>
                                    <li><b>Primary Dressing: </b>{singleAssessment.Primary}</li>
                                    <li><b>Secondary Dressing: </b>{singleAssessment.Secondary}</li>
                                    <li><b>Fixation: </b>{singleAssessment.Fixation}</li>
                                    <li><b>Additional Interventions: </b>{singleAssessment.AdditionalIntervention}</li>
                                </ul>
                            </Card>) :
                            <Card><i>Select wound from history to review assessment details here.</i></Card>}
                    </Row>
                </Column>
            </Row>
        </Layout >
    </>
}

export default WoundHistoryPage;
