import { ExternalLink } from 'lucide-react'

const brokers = [
  {
    name: 'Fidelity',
    tagline: 'No fees, no minimums',
    url: 'https://www.fidelity.com/open-account/overview',
  },
  {
    name: 'Robinhood',
    tagline: 'Great for beginners',
    url: 'https://robinhood.com/us/en/',
  },
  {
    name: 'Charles Schwab',
    tagline: 'Full-service brokerage',
    url: 'https://www.schwab.com/open-an-account',
  },
]

export default function BrokerageLinks() {
  return (
    <div className="bg-surface border border-border-subtle rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold tracking-tight text-text-primary">Ready to Open Your Account?</h3>
        <p className="text-text-muted text-sm mt-1">All three are free with no minimums to get started.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {brokers.map((broker) => (
          <a
            key={broker.name}
            href={broker.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface-elevated border border-border-subtle rounded-xl p-4 flex flex-col gap-3 hover:border-primary/40 hover:bg-surface-elevated/80 transition-colors group"
          >
            <div>
              <div className="font-semibold text-text-primary group-hover:text-primary transition-colors">{broker.name}</div>
              <div className="text-xs text-text-muted mt-0.5">{broker.tagline}</div>
            </div>
            <div className="flex items-center gap-1 text-xs text-primary font-medium">
              Open Account <ExternalLink size={11} />
            </div>
          </a>
        ))}
      </div>

      <p className="text-xs text-text-muted/50 mt-3 text-center">
        StackSmart is not affiliated with these platforms. Not financial advice.
      </p>
    </div>
  )
}
