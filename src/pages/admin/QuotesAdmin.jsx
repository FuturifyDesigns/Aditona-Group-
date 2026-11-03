import EnquiriesAdmin from './EnquiriesAdmin'

/** Quote requests from /request-quote — separate from general enquiries. */
export default function QuotesAdmin() {
  return <EnquiriesAdmin mode="quotes" />
}
