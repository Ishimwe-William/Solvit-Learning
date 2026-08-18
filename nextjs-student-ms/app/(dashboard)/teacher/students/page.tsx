import {createClient} from "@/lib/supabase/server";
import {MembersTable} from "@/components/teacher/MembersTable";

export default async function MembersPage() {
    const supabase = await createClient();

    const {data: members, error} = await supabase
        .from("profiles")
        .select("id, full_name, email, role, status, created_at")
        .order("created_at", {ascending: false})

    if (error) {
        console.error("Error fetching members: ", error.message)
    }

    return (
        <div className="space-y-6">
            <MembersTable initialUsers={members || []} />
        </div>
    );
}
