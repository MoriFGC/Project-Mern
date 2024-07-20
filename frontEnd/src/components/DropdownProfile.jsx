import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import img from '../assets/user.svg'

export default function DropdownProfile({ handleLogout, author }) {
    const navigate = useNavigate()

    if (!author) {
        return null; // o un componente di caricamento
    }

    const dropdownItems = [
        {name: 'Profile', onClick: () => navigate(`/author/${author._id}`)},
        {name: 'Settings', href: '#'},
        {name: 'Logout', onClick: handleLogout},
    ]

    return (
        <Menu>
            {({ open }) => (
                <>
                    <MenuButton className='rounded-full w-12'>
                        {author.avatar ? (
                            <img className='rounded-full border-2 border-verde' src={author.avatar} alt={author.nome} />
                        ) : (
                            <img className='rounded-full border-2 border-verde' src={img} alt={author.nome} />
                        )}
                    </MenuButton>  
                    <AnimatePresence>
                        {open && ( 
                            <MenuItems  
                                static
                                as={motion.div}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                anchor="bottom"
                                className="origin-top bg-white dark:bg-[#222831] text-black dark:text-white rounded-lg shadow-lg w-36 p-4 mt-8 flex flex-col"
                            >
                                {dropdownItems.map((item, index) => (
                                    <MenuItem 
                                        as='a' 
                                        key={index} 
                                        href={item.href}
                                        onClick={item.onClick}
                                        className='text-sm p-2 rounded-md hover:bg-[#38495a] hover:text-verde transition-all duration-300'
                                    >
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </MenuItems>
                        )}
                    </AnimatePresence>
                </>
            )}
        </Menu>
    )
}