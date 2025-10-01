import TradingViewWidget from "@/components/TradingViewWidget"
import { HEATMAP_WIDGET_CONFIG, MARKET_DATA_WIDGET_CONFIG, MARKET_OVERVIEW_WIDGET_CONFIG, TOP_STORIES_WIDGET_CONFIG } from "@/lib/constants"

const Home = () => {
  const scriptUrl = "https://s3.tradingview.com/external-embedding/embed-widget-"
  return (
    <div className="min-h-screen p-4">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
        {/* Top Left - Market Overview */}
        <div className="bg-gray-900 rounded-lg">
          <TradingViewWidget
            title="Market Overview"
            scriptUrl={`${scriptUrl}market-overview.js`}
            config={MARKET_OVERVIEW_WIDGET_CONFIG}
            className="custom-chart"
            height={400}
          />
        </div>
        
        {/* Top Right - Stock Heatmap */}
        <div className="bg-gray-900 rounded-lg">
          <TradingViewWidget
            title="Stock Heatmap"
            scriptUrl={`${scriptUrl}stock-heatmap.js`}
            config={HEATMAP_WIDGET_CONFIG}
            height={400}
          />
        </div>
        
        {/* Bottom Left - Top Stories */}
        <div className="bg-gray-900 rounded-lg">
          <TradingViewWidget
            scriptUrl={`${scriptUrl}timeline.js`}
            config={TOP_STORIES_WIDGET_CONFIG}
            className="custom-chart"
            height={400}
          />
        </div>
        
        {/* Bottom Right - Market Data */}
        <div className="bg-gray-900 rounded-lg">
          <TradingViewWidget
            scriptUrl={`${scriptUrl}market-quotes.js`}
            config={MARKET_DATA_WIDGET_CONFIG}
            height={400}
          />
        </div>
      </section>
    </div>
  )
}

export default Home