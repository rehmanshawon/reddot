import { Component } from "react";
import { captureException } from "../lib/errorReporting";

export default class AppErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    captureException(error, { componentStack: errorInfo.componentStack });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main style={{ maxWidth: "40rem", margin: "8rem auto", padding: "2rem" }}>
        <h1>Something went wrong</h1>
        <p>Please reload the page and try again.</p>
        <button
          type="button"
          className="button button--solid"
          onClick={this.handleReload}
        >
          Reload page
        </button>
      </main>
    );
  }
}
