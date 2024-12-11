import { role } from "@/lib/data";
import { getCurrentUser } from "@/lib/functs";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        libelle:"Accueil",
        href: "/",
        visible: ["Admin", "Teacher", "Student", "Parent","Owner"],
      },
      {
        icon: "/teacher.png",
        label: "Teachers",
        libelle:"Enseignants",
        href: "/list/teachers",
        visible: ["Admin", "Teacher"],
      },
      {
        icon: "/student.png",
        label: "Students",
        libelle:"Etudiants",
        href: "/list/students",
        visible: ["Admin", "Teacher"],
      },
      {
        icon: "/parent.png",
        label: "Parents",
        libelle:"Parents",
        href: "/list/parents",
        visible: ["Admin", "Teacher"],
      },
      {
        icon: "/subject.png",
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
        icon: "/message.png",
        label: "Messages",
        libelle:"Messages",
        href: "/list/messages",
        visible: ["Admin", "Teacher", "Student", "Parent"],
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

const Menu = async () => {
  const currentUser = await getCurrentUser()
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {currentUser?.role === "Français"? i.title:i.frenchTitle}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(currentUser?.role? currentUser?.role:"")) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{currentUser?.lang !== "Français"? item.label:item.libelle}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
