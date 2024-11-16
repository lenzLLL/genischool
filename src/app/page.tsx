import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const Homepage = async () => {
  const cookieStore = await cookies()
  if(cookieStore.get("auth")){
    redirect("/admin")
  }
  else{
    redirect("/sign-in")
  }
  return (
    <div className=''>Homepage</div>
  )
}

export default Homepage