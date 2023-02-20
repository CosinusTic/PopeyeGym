import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ProfileCoachView from "../views/ProfileCoachView.vue";
import SchemesView from "../views/Schemes.vue";
import RecipeView from "../views/RecipeView.vue";
import UserManagementView from "../views/UserManagementView.vue";
import CoachManagementView from "../views/CoachManagementView.vue";
import ProfileUserView from "../views/ProfileUserView.vue";
import FitnessClubsMapView from "../views/FitnessClubsMapView.vue";
import AllCoachesView from "../views/AllCoachesView.vue";
import AdminDashboardView from "../views/AdminDashboardView.vue";
import AdminAppointmentView from "../views/AdminAppointmentView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/mycoachprofile",
      name: "coach_profile",
      component: ProfileCoachView,
    },
    {
      path: "/schemes",
      name: "schemes",
      component: SchemesView,
    },
    {
      path: "/recipes",
      name: "recipes",
      component: RecipeView,
    },
    {
      path: "/usermanagement",
      name: "user_management",
      component: UserManagementView,
    },
    {
      path: "/coachmanagement",
      name: "coach_management",
      component: CoachManagementView,
    },
    {
      path: "/userProfile",
      name: "userProfile",
      component: ProfileUserView,
    },
    {
      path: "/clubsmap",
      name: "clubs_map",
      component: FitnessClubsMapView,
    },
    {
      path: "/allcoaches",
      name: "all_coaches",
      component: AllCoachesView,
    },
    {
      path: "/admindashboard",
      name: "admin_dashboard",
      component: AdminDashboardView,
    },
    {
      path: "/adminappointment",
      name: "admin_appointment",
      component: AdminAppointmentView,
    },
  ],
});

export default router;
