import PropTypes from 'prop-types'
import { CRow } from '@coreui/react'

const WidgetsBrand = (props) => {
  return <CRow className={props.className} xs={{ gutter: 4 }}></CRow>
}

WidgetsBrand.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsBrand
