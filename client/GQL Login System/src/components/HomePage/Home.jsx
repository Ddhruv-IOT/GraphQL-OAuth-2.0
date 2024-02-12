import { useQuery, gql } from '@apollo/client';
import {
    MDBBtn
  } from "mdb-react-ui-kit";

function Home() {
    const token = localStorage.getItem('token');

    const { loading, error, data } = useQuery(
        gql`
            query {
                secretcode {
                    id
                    secret
                }
            }
        `,
        {
            context: {
                headers: {
                    Authorization: `${token}`, // Make sure to add 'Bearer' before the token
                },
            },
        }
    );

    // Render loading state
    if (loading) return <p>Loading...</p>;

    // Render error message if there's an error
    if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            <h1>HELLO DEVELOPER!👋👋👋</h1>
            <p>Secret Code ID: {data && data.secretcode[0].id}</p>
            {console.log(data)}
            <p>Secret Code: {data && data.secretcode[0].secret}</p>
            <MDBBtn outline className="mx-2" color="danger" onClick={() => {localStorage.removeItem('token'); window.location.href = "/";}}>
                    Securly Exit
                </MDBBtn>
            
        </>
    );
}

export default Home;
