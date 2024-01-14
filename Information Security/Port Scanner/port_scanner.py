import socket
import ipaddress
import re
from common_ports import ports_and_services


def get_open_ports(target, port_range, verbose = False):
    open_ports = []

    ip = ""
    hostname = ""

    ipPattern = re.compile(r'[\d\.]')
    # Checks if ip or hostname is given
    if ipPattern.match(target):
        try:
            # If valid ip address
            ipaddress.ip_address(target)
            ip  = target
        except ValueError:
            return "Error: Invalid IP address"
        try:
            # Try to get the hostname of the ip
            hostname, _, _ = socket.gethostbyaddr(ip)
        except socket.herror:
            pass
    else:
        try:
            # Try to get the ip of hostname
            ip = socket.gethostbyname(target)
            hostname = target
        except socket.gaierror:
            return "Error: Invalid hostname"

    for port in range(port_range[0], port_range[1] + 1):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(5)
        
        # If port is open
        if not s.connect_ex((ip, int(port))):
            open_ports.append(port)
        
        s.close()

    if verbose:
        text = f"Open ports for "
        # If there is a hostname, use it; if not just use the ip
        if hostname != "":
            text += f"{hostname} ({ip})"
        else:
            text += ip
        text += "\nPORT     SERVICE"
        for port in open_ports:
            text += f"\n{port:<9}{ports_and_services[port]}"
        return text
        
    return (open_ports)
