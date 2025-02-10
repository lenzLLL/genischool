import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  Notebook,
  User,
  Volume2,
  Wallet
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  libelle:string;
  active?: boolean;
  visible?:string[]
};

type Menu = {
  href: string;
  label: string;
  libelle:string;
  active?: boolean;
  icon: LucideIcon;
  visible?:string[]
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.svg",
        label: "Home",
        libelle:"Accueil",
        href: "/",
        visible: ["Admin", "Teacher", "Student", "Parent","Owner"],
      },
      {
        icon: "/teachers.svg",
        label: "Teachers",
        libelle:"Enseignants",
        href: "/list/teachers",
        visible: ["Admin", "Teacher"],
      },
      {
        icon: "/student.svg",
        label: "Students",
        libelle:"Etudiants",
        href: "/list/students",
        visible: ["Admin", "Teacher"],
      },
      {
        icon: "/parent.svg",
        label: "Parents",
        libelle:"Parents",
        href: "/list/parents",
        visible: ["Admin", "Teacher"],
      },
      {
        icon: "/sub.svg",
        label: "Subjects",
        libelle:"Matières",
        href: "/list/subjects",
        visible: ["Admin"],
      },
      {
        icon: "/class.png",
        label: "Classes",
        libelle:"Classes",
        href: "/list/classes",
        visible: ["Admin", "Teacher"],
      },
      {
        icon: "/lesson.png",
        label: "Lessons",
        libelle:"Leçons",
        href: "/list/lessons",
        visible: ["Admin", "Teacher"],
      },
      {
        icon: "/exam.png",
        label: "Exams",
        libelle:"Examens",
        href: "/list/exams",
        visible: ["Admin", "Teacher", "Student", "Parent"],
      },
      {
        icon: "/result.png",
        label: "Results",
        libelle:"Resultats",
        href: "/list/results",
        visible: ["Admin", "Teacher", "Student", "Parent"],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        libelle:"Absences",
        href: "/list/attendance",
        visible: ["Admin", "Teacher", "Student", "Parent"],
      },
      {
        icon: "/calendar.png",
        label: "Events",
        libelle:"Evènements",
        href: "/list/events",
        visible: ["Admin", "Teacher", "Student", "Parent"],
      },
      {
        icon: "/money.svg",
        libelle: "Pensions",
        label:"Boarding fees",
        href: "/list/fees",
        visible: ["Admin"],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        libelle:"Annonces",
        href: "/list/announcements",
        visible: ["Admin", "Teacher", "Student", "Parent"],
      },
      {
        icon: "/school.png",
        label: "Schools",
        libelle:"Schools",
        href: "/list/schools",
        visible: ["Owner"],
      },

    ],
  },
  {
    title: "OTHER",
    frenchTitle:"AUTRES",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        libelle:"Profil",
        href: "/profile",
        visible: ["Admin", "Teacher", "Student", "Parent"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        libelle:"Paramètres",
        href: "/settings",
        visible: ["Admin", "Teacher", "Student", "Parent"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        libelle:"Déconnexion",
        href: "/logout",
        visible: ["Admin", "Teacher", "Student", "Parent"],
      },
    ],
  },
];
export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/admin",
          label: "Dashboard",
          libelle:"Dasboard",
          icon: LayoutGrid,
          visible: ["Admin"]
        }
      ]
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "",
          label: "List",
          libelle:"Liste",
          icon: SquarePen,
          submenus: [
            {
              label: "Teachers",
              libelle:"Enseignants",
              href: "/list/teachers",
              visible: ["Admin", "Teacher"],
            },
            {
              label: "Students",
              libelle:"Etudiants",
              href: "/list/students",
              visible: ["Admin", "Teacher"],
            },
            {
              label: "Parents",
              libelle:"Parents",
              href: "/list/parents",
              visible: ["Admin", "Teacher"],
            },
            {
              label: "Subjects",
              libelle:"Matières",
              href: "/list/subjects",
              visible: ["Admin"],
            },
            {
              label: "Classes",
              libelle:"Classes",
              href: "/list/classes",
              visible: ["Admin", "Teacher"],
            },
            {
              label: "Lessons",
              libelle:"Leçons",
              href: "/list/lessons",
              visible: ["Admin", "Teacher"],
            },
            {
              label: "Attendance",
              libelle:"Absences",
              href: "/list/attendance",
              visible: ["Admin", "Teacher", "Student", "Parent"],
            },
          ]
        },
        {
          href: "",
          label: "Exams",
          libelle:"Examens",
          icon: Notebook,
          submenus: [
        
            {
              label: "List",
              libelle:"Liste",
              href: "/list/exams",
              visible: ["Admin", "Teacher", "Student", "Parent"],
            },
            {
              label: "Results",
              libelle:"Resultats",
              href: "/list/results",
              visible: ["Admin", "Teacher", "Student", "Parent"],
            }
       
          ]
        },
        {
          href: "",
          label: "Com",
          libelle:"Com",
          icon: Volume2,
          submenus:[
            {
              label: "Events",
              libelle:"Evènements",
              href: "/list/events",
              visible: ["Admin", "Teacher", "Student", "Parent"],
            },
     
            {
              label: "Announcements",
              libelle:"Annonces",
              href: "/list/announcements",
              visible: ["Admin", "Teacher", "Student", "Parent"],
            },
          ]
        },
        {
          href: "",
          label: "Finance",
          libelle:"Finances",
          icon: Wallet,
          submenus:[
            {
              label: "Fees",
              libelle:"Pension",
              href: "/fees",
              visible: ["Admin"],
            },
            {
              label: "Accounting",
              libelle:"Comptabilité",
              href: "/accounting",
              visible: ["Admin", "Accounter"],
            },
          ]
        }
      ]
    },
    {
      groupLabel: "Account",
      menus: [
        {
          href: "/profil",
          label: "Profile",
          libelle:"Profil",
          icon: User,
          visible: ["Admin"]

        },
        {
          href: "/account",
          label: "Setting",
          libelle:"Paramètres",
          icon: Settings,
          visible: ["Admin"]

        }
      ]
    }
  ];
}
