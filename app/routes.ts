import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("features/home/HomePage.jsx"),
  
  route("your-content", "components/YourContentPage.jsx"),
  route("quiz", "features/quiz/Quiz.jsx"),
  route("quiz/results", "features/quiz/Results.jsx"),
  route("technology-types", "features/quiz/TechnologyTypesPage.jsx"),
  
  route("activities", "components/ActivitiesPage.jsx"),
  route("activity/:pageId", "routes/ContentPage.jsx", { id: "activity-content-page" }),
  route("activity-sets", "components/ActivitySetsPage.jsx"),
  route("alternative-social-tech", "components/AlternativeSocialTechPage.jsx"),
  
  route("contributors", "components/ContributorsPage.jsx"),
  
  // We keep the dynamic loader logic in App.jsx for now to avoid a large refactor
  route("content/:pageId", "routes/ContentPage.jsx"),

  // Catch-all for undefined routes
  route("*", "routes/NotFoundPage.jsx"),
] satisfies RouteConfig;