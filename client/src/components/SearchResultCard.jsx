export default function SearchResultCard({ user }) {
    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
                <img 
                    src={user.imageUrl || "/userImage.png"} 
                    alt="user" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#e76f51]" 
                />
                <div className="flex-1">
                    <div className="font-semibold text-xl text-[#264653] mb-2">{user.name}</div>
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">Skills: </span>
                        {user.skillsHave?.length > 0 
                            ? user.skillsHave.map(s => s.name).join(", ")
                            : "No skills listed"
                        }
                    </div>
                    {user.skillsHave?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {user.skillsHave.slice(0, 5).map((skill, index) => (
                                <span 
                                    key={index}
                                    className="px-3 py-1 bg-[#e76f51]/10 text-[#e76f51] rounded-full text-xs font-medium"
                                >
                                    {skill.name}
                                </span>
                            ))}
                            {user.skillsHave.length > 5 && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                    +{user.skillsHave.length - 5} more
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <button 
                    className="px-4 py-2 bg-[#e76f51] text-white rounded-lg hover:bg-[#d65d42] transition-colors font-medium"
                    onClick={() => window.open(`/profile/${user._id}`, '_blank')}
                >
                    View Profile
                </button>
            </div>
        </div>
    );
}