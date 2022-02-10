import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import RetrospectiveContainer from '../features/retrospective/containers/Retrospective'

export const getServerSideProps = withPageAuthRequired()

export default function Retrospective() {
  return <RetrospectiveContainer />
}
