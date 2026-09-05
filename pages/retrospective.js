import { withPageAuthRequired } from '../features/common/auth'
import RetrospectiveContainer from '../features/retrospective/containers/Retrospective'

export const getServerSideProps = withPageAuthRequired()

export default function Retrospective() {
  return <RetrospectiveContainer />
}
