import { Switch, Route } from "wouter";
import Home from "./pages/Home";

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-gray-500 mb-6">Stránka nenalezena</p>
        <a href="/" className="text-green-700 underline">Zpět na hlavní stránku</a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}
