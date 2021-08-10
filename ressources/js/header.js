let headerHtml =
    '<header\n' +
    '    class="h-32 w-screen bg-gradient-to-t from-yellow-500 to-yellow-200 flex flex-col justify-center items-center">\n' +
    '    <h1 class="text-3xl font-medium">Bienvenue sur Trouver votre Destination!</h1>\n' +
    '    <span>Et partez en toute tranquilité :D</span>\n' +
    '</header>'

class Header {
    pushHtml() {
        return headerHtml
    }
}

export default Header